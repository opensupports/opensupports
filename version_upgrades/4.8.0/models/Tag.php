<?php

//documentacion
class Tag extends DataStore {
    const TABLE = 'tag';

    public static function getProps() {
        return [
            'name',
            'color'
        ];
    }

    public function toArray($minimized = false) {
        if($minimized){
            return $this->name;
        } else {
            return [
                'id'=> $this->id,
                'name'=> $this->name,
                'color' => $this->color
            ];
        }
    }
}
